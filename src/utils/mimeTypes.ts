// mimeTypes.ts

// 파일별 mimeType 구분
export const imageTypes: Record<'jpg' | 'jpeg' | 'png' | 'gif', string> = {
    jpg: 'image/jpg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
};

export const videoTypes: Record<'mp4' | 'webm' | 'avi' | 'mov' | 'mkv', string> = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    mkv: 'video/x-matroska',
};

export const documentTypes: Record<'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'hwp', string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    hwp: 'application/x-hwp', // HWP 파일 MIME 타입 추가
};

// 모든 MIME 타입을 통합한 객체
export const mimeTypes = {
    ...imageTypes,
    ...videoTypes,
    ...documentTypes,
};

// 특정 확장자에 대한 MIME 타입을 반환하는 함수
export const getMimeType = (extension: string): string | undefined => {
    return mimeTypes[extension as keyof typeof mimeTypes];
};
