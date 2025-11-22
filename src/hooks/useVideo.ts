import { useMutation } from '@tanstack/react-query';

interface DownloadVideoParams {
    downloadLink: string;
    apiKey: string;
}

const downloadVideo = async ({ downloadLink, apiKey }: DownloadVideoParams): Promise<Blob> => {
    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!response.ok) {
        throw new Error('Failed to download video');
    }
    return await response.blob();
};

export const useDownloadVideo = () => {
    return useMutation({
        mutationFn: downloadVideo,
    });
};
