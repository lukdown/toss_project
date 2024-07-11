import axios from 'axios';

export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/image_description/',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    throw error;
  }
}