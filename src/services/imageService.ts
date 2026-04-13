const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImagem(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "patrimonios_image");

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error("Erro no upload:", data);
        throw new Error(data.error?.message || "Erro ao enviar imagem");
    }

    return data.secure_url;
}

export async function deleteImagem(url: string): Promise<void> {
    if (!url) return;

    console.warn("Remoção apenas lógica (Cloudinary não será afetado):", url);

}