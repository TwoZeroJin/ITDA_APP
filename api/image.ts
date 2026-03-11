import { ApiResult, FileInfo } from '@/types';
import axiosInstance from './axios';

const MULTIPART_FORM_HEADER = {
    headers: { 'Content-Type': 'multipart/form-data' },
  }

  /**
   * 단일 파일 업로드
   */
async function imageUpload(form: FormData, utype = '0', ukey = '0'): Promise<ApiResult<FileInfo>> {
  const { data } = await axiosInstance.post('/file/file_upload', form, MULTIPART_FORM_HEADER);

  return data;
}

/**
 * 다중 파일 업로드
 * 서버: /api/file/files_upload  (RequestPart name = "upfile", 다수)
 */
async function imagesUpload(form: FormData, utype = '0', ukey = '0'): Promise<ApiResult<FileInfo[]>> {
  const { data } = await axiosInstance.post('/file/files_upload', form, MULTIPART_FORM_HEADER);

  return data;
}

export { imageUpload, imagesUpload };

