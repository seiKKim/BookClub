import { IncomingMessage } from "http";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

// Object Storage 환경 설정
const OS_STORAGE_ENDPOINT = process.env.REACT_APP_OS_STORAGE_ENDPOINT || "";
const OS_IDENTITY_ENDPOINT = process.env.REACT_APP_OS_IDENTITY_ENDPOINT || "";
const OS_TENANT_ID = process.env.REACT_APP_OS_TENANTID || "";
const OS_USER_ID = process.env.REACT_APP_OS_USER_ID || "";
const OS_PASSWORD = process.env.REACT_APP_OS_PASSWORD || "";

// 환경 변수 확인
if (
  !OS_STORAGE_ENDPOINT ||
  !OS_IDENTITY_ENDPOINT ||
  !OS_TENANT_ID ||
  !OS_USER_ID ||
  !OS_PASSWORD
) {
  throw new Error(
    "환경 변수가 제대로 설정되지 않았습니다. .env 파일을 확인하세요."
  );
}

// Formidable 설정
const form = formidable({ multiples: true, keepExtensions: true });

export const config = {
  api: { bodyParser: false },
};

async function convertNextRequestToNodeRequest(
  req: Request
): Promise<IncomingMessage> {
  const body = await req.arrayBuffer();
  const stream = new Readable();
  stream.push(Buffer.from(body));
  stream.push(null);
  return Object.assign(stream, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.url,
  }) as unknown as IncomingMessage;
}

async function uploadToObjectStorage(
  file: any,
  folder: string
): Promise<string> {
  try {
    // 디버깅: 파일 정보 확인
    console.log("업로드할 파일 정보:", file);

    if (!file?.filepath || !file?.originalFilename) {
      throw new Error(
        `파일이 제대로 업로드되지 않았습니다. 
          파일 경로: ${file.filepath}, 파일 이름: ${file.originalFilename}`
      );
    }

    const fileExtension = path.extname(file.originalFilename || ""); // 기본값 설정
    if (!fileExtension) {
      throw new Error(
        `파일 이름이 유효하지 않거나 확장자가 없습니다: ${file.originalFilename}`
      );
    }

    // 파일 이름 구성
    const fileName = `${folder}/${uuidv4()}${fileExtension}`;
    const fileContent = await fs.readFile(file.filepath);

    // 디버깅: Object Storage 업로드 전에 확인
    console.log("저장될 파일 이름:", fileName);
    console.log("파일 크기:", file.size);

    // Object Storage 인증
    const authResponse = await fetch(OS_IDENTITY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth: {
          identity: {
            methods: ["password"],
            password: {
              user: { id: OS_USER_ID, password: OS_PASSWORD },
            },
          },
          scope: { project: { id: OS_TENANT_ID } },
        },
      }),
    });

    if (!authResponse.ok) throw new Error("Object Storage 인증 실패");
    const token = authResponse.headers.get("X-Subject-Token");
    if (!token) throw new Error("토큰 발급 실패");

    // 파일 업로드
    const uploadResponse = await fetch(`${OS_STORAGE_ENDPOINT}/${fileName}`, {
      method: "PUT",
      headers: {
        "X-Auth-Token": token,
        "Content-Length": file.size.toString(),
        "Content-Type": file.mimetype,
      },
      body: fileContent,
    });

    if (!uploadResponse.ok) throw new Error("파일 업로드 실패");

    return `${OS_STORAGE_ENDPOINT}/${fileName}`;
  } catch (error) {
    console.error("Object Storage 업로드 중 오류:", error);
    throw error;
  }
}

export async function POST(request: Request) {
    try {
      const req = await convertNextRequestToNodeRequest(request);
  
      const parsedData: any = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            console.error("폼 데이터 파싱 중 오류 발생:", err);
            reject(err);
          } else {
            resolve({ fields, files });
          }
        });
      });
  
      const { fields, files } = parsedData;
      const {
        title: rawTitle,
        author: rawAuthor,
        description: rawDescription,
        format: rawFormat,
        genre: rawGenre,
        categories: rawCategories,
      } = fields;
  
      const thumbnail = Array.isArray(files.thumbnail)
        ? files.thumbnail[0]
        : files.thumbnail;
      const pdf = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
  
      if (!rawTitle || !rawAuthor || !rawGenre || !pdf) {
        return NextResponse.json(
          { error: "필수 입력 필드가 누락되었습니다." },
          { status: 400 }
        );
      }
  
      const title = Array.isArray(rawTitle) ? rawTitle[0] : rawTitle;
      const author = Array.isArray(rawAuthor) ? rawAuthor[0] : rawAuthor;
      const description = Array.isArray(rawDescription)
        ? rawDescription[0]
        : rawDescription || null;
      const format = Array.isArray(rawFormat) ? rawFormat[0] : rawFormat || "EBOOK";
      const genre = Array.isArray(rawGenre) ? rawGenre[0] : rawGenre;
      const categories = Array.isArray(rawCategories)
        ? JSON.parse(rawCategories[0])
        : JSON.parse(rawCategories);
  
      let thumbnailUrl = null;
      if (thumbnail) {
        thumbnailUrl = await uploadToObjectStorage(thumbnail, "thumbnail");
      }
  
      const pdfUrl = await uploadToObjectStorage(pdf, "upload");
  
      const newBook = await prisma.book.create({
        data: {
          title,
          author,
          description,
          coverImage: thumbnailUrl || "", // 수정된 부분
          format,
          genre,
          contentUrl: pdfUrl,
          categories: {
            connectOrCreate: categories.map((category: string) => ({
              where: { name: category },
              create: { name: category },
            })),
          },
        },
      });
  
      return NextResponse.json({
        message: "책이 성공적으로 등록되었습니다.",
        book: newBook,
      });
    } catch (error: any) {
      console.error("책 등록 중 오류 발생:", error);
      return NextResponse.json(
        { error: "책 등록 중 문제가 발생했습니다.", details: error.message },
        { status: 500 }
      );
    }
  }
  
//   책 조회 api
export async function GET() {
    try {
      // 모든 책 데이터 가져오기 (isDeleted가 false인 데이터만)
      const books = await prisma.book.findMany({
        where: {
          isDeleted: false, // 삭제되지 않은 책만 가져오기
        },
        orderBy: {
          createdAt: "desc", // 최신 순 정렬
        },
        include: {
          categories: true, // 카테고리 포함
        },
      });
  
      // 책 데이터 반환
      return NextResponse.json(books, { status: 200 });
    } catch (error) {
      console.error("책 목록 가져오기 오류:", error);
  
      // 오류 반환
      return NextResponse.json(
        { error: "책 목록을 가져오는 중 문제가 발생하였습니다." },
        { status: 500 }
      );
    }
  }