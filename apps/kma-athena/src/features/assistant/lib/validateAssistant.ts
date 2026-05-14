/**
 * 나만의 비서에 대한 validation 정의
 */

type ValidateAssistantFilesParams = {
  incomingFiles: File[];
  currentFileCount: number;
};

type ValidateAssistantFilesResult = { ok: true; files: File[] } | { ok: false; message: string };

export const MAX_NAME_LENGTH = 15;
export const MAX_PERSONA_LENGTH = 300;
export const MAX_FILES = 10;
export const MAX_FILE_SIZE_MB = 10;
export const LIMIT_FILE_TYPE = ['docx', 'hwp', 'pdf'];

export function validateAssistantFiles({
  incomingFiles,
  currentFileCount,
}: ValidateAssistantFilesParams): ValidateAssistantFilesResult {
  if (incomingFiles.length === 0) {
    return { ok: true, files: [] };
  }

  const hasFormatError = incomingFiles.some((file) => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    return !LIMIT_FILE_TYPE.includes(ext);
  });

  if (hasFormatError) {
    return {
      ok: false,
      message: `파일 형식을 확인해주세요. ${LIMIT_FILE_TYPE.join(', ')} 파일만 업로드됩니다.`,
    };
  }

  const hasSizeError = incomingFiles.some((file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
  const wouldExceedCount = currentFileCount + incomingFiles.length > MAX_FILES;

  if (hasSizeError) {
    return { ok: false, message: `${MAX_FILE_SIZE_MB}MB를 초과하는 파일은 업로드할 수 없습니다.` };
  }

  if (wouldExceedCount) {
    return { ok: false, message: `파일은 최대 ${MAX_FILES}개까지만 업로드하실 수 있습니다.` };
  }

  return { ok: true, files: incomingFiles };
}
