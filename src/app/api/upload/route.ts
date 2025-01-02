import { NextRequest, NextResponse } from 'next/server';
import { getMimeType } from '@/utils/mimeTypes';
import axios from 'axios';
import FormData from 'form-data';

const OS_STORAGE_ENDPOINT = process.env.OS_STORAGE_ENDPOINT || '';
const OS_IDENTITY_ENDPOINT = process.env.OS_IDENTITY_ENDPOINT || '';
const OS_USERNAME = process.env.OS_USERNAME || '';
const OS_PASSWORD = process.env.OS_PASSWORD || '';
const OS_TENANTID = process.env.OS_TENANTID || '';

if (!OS_STORAGE_ENDPOINT) throw new Error('OS_STORAGE_ENDPOINT is missing.');
if (!OS_IDENTITY_ENDPOINT) throw new Error('OS_IDENTITY_ENDPOINT is missing.');
if (!OS_USERNAME) throw new Error('OS_USERNAME is missing.');
if (!OS_PASSWORD) throw new Error('OS_PASSWORD is missing.');
if (!OS_TENANTID) throw new Error('OS_TENANTID is missing.');

async function getAuthToken(): Promise<string> {
    try {
        const response = await axios.post(`${OS_IDENTITY_ENDPOINT}`, {
            auth: {
                identity: {
                    methods: ['password'],
                    password: {
                        user: {
                            name: OS_USERNAME,
                            domain: { name: 'Default' },
                            password: OS_PASSWORD,
                        },
                    },
                },
                scope: {
                    project: {
                        id: OS_TENANTID,
                    },
                },
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const token = response.headers['x-subject-token'];
        if (!token) {
            throw new Error('Failed to retrieve token from response.');
        }
        return token;
    } catch (error) {
        console.error('Failed to issue token:', error);
        throw new Error('Authentication failed.');
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = await getAuthToken();

        const formDataReq = await req.formData();
        const uploadedFile = formDataReq.get('file') as File;

        if (!uploadedFile) {
            return NextResponse.json({ message: 'No file attached' }, { status: 400 });
        }

        // Convert File to ArrayBuffer then to Buffer
        const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

        const formData = new FormData();
        formData.append('file', fileBuffer, {
            filename: uploadedFile.name,
            contentType: uploadedFile.type,
        });

        const response = await axios.put(
            `${OS_STORAGE_ENDPOINT}/upload/${uploadedFile.name}`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'X-Auth-Token': token,
                },
                timeout: 10000,
            }
        );

        return NextResponse.json({ message: 'File uploaded successfully', data: response.data });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || error.message;
            console.error('Axios error:', errorMessage);
            return NextResponse.json({ message: 'File upload failed', error: errorMessage }, { status: 500 });
        }
        console.error('Unexpected error:', error);
        return NextResponse.json({ message: 'File upload failed', error: 'An unknown error occurred' }, { status: 500 });
    }
}

// Extend or modify next.js routing configuration if necessary
