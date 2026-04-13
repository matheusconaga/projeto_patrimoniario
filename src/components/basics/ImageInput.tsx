import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { Trash } from "lucide-react";
import image_default from "../../assets/image_default.png";
import AppButton from "./AppButton";
import Titulo from "../layout/Titulo";
import { COLORS } from "../../constants/colors";

type ImageInputProps = {
  titulo?: string;
  valorInicial?: string;
  onChange: (value: File | null | undefined) => void;
  disabled?: boolean;
};

export default function ImageInput({
  titulo,
  valorInicial,
  onChange,
  disabled = false,
}: ImageInputProps) {
  const [preview, setPreview] = useState<string>(image_default);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const temImagem = !!file || (!!valorInicial && valorInicial !== "-");


  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
      return;
    }

    if (!valorInicial || valorInicial === "-") {
      setPreview(image_default);
      return;
    }

    setPreview(valorInicial);
  }, [valorInicial, file]);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    onChange(f);
  };

  const handleRemove = useCallback(() => {
    setFile(null);
    setPreview(image_default);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [onChange]);

  return (
    <Container>
      {titulo && <Titulo title={titulo} marginBottom="4px" />}

      <ImageArea
        $temImagem={temImagem}
        onClick={() => {
          if (!disabled && !temImagem) inputRef.current?.click();
        }}
        style={{
          opacity: disabled ? 0.6 : 1,
        }}
      >


        <Preview src={preview} alt="Prévia da imagem" />

        {!temImagem && (
          <Overlay disabled={disabled}>
            <ChangeText>Selecionar imagem</ChangeText>
          </Overlay>
        )}

      </ImageArea>

      {!disabled && preview !== image_default && (
        <AppButton
          text="Remover"
          func={handleRemove}
          icon={<Trash size={20} />}
          color={COLORS.cancel_card}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleSelectImage}
        disabled={disabled}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const ImageArea = styled.div<{ $temImagem: boolean }>`
  position: relative;
  min-width: 140px;
  max-width: 170px;
  aspect-ratio: 1 / 1;
  border: 2px dashed #ccc;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f8f8f8;
  transition: border-color 0.2s;

  ${({ $temImagem }) =>
    !$temImagem &&
    `
    &:hover {
      border-color: ${COLORS.primary};
      cursor: pointer;
    }
  `}

  @media (max-width: 768px) {
    min-width: 110px;
    max-width: 120px;
    border-width: 1.5px;
  }
`;



const Preview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  @media (max-width: 768px) {
    object-fit: contain;
  }
`;

const Overlay = styled.div<{ disabled: boolean }>`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
  font-size: 14px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  ${ImageArea}:hover & {
    opacity: ${(props) => (props.disabled ? 0 : 1)};
  }
`;

const ChangeText = styled.span`
  background: rgba(0, 0, 0, 0.6);
  padding: 6px 10px;
  border-radius: 6px;
`;
