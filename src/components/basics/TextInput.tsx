import styled from "styled-components";
import Titulo from "../layout/Titulo";
import { COLORS } from "../../constants/colors";
import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export type Option = {
    label: string;
    value: string;
    element?: React.ReactNode;
};

type GenericInputProps = {
    title: string;
    required?: boolean;
    type?: "text" | "textarea" | "select" | "select+text" | "password" | "select-cards" | "select-creatable" | "number" | "datetime";
    placeholder?: string;
    options?: Option[];
    value?: string;
    onChange?: (value: string) => void;
    width?: string;
    icon?: React.ReactNode;
    externalError?: string;
    onSelectOption?: (value: string) => void;
    disabled?: boolean;
    allowCreate?: boolean;
};

export default function TextInput({
    title,
    required = false,
    type = "text",
    placeholder = "Digite algo...",
    options = [],
    value = "",
    onChange,
    width = "250px",
    icon,
    allowCreate,
    externalError = "",
    onSelectOption,
    disabled = false,
}: GenericInputProps) {

    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const hasError = externalError !== "" || error;

    const handleBlur = () => {
        if (externalError) return;
        if (required && (!value || value.trim() === "")) setError(true);
        else setError(false);
    };

    const handleChange = (val: string) => {
        setError(false);
        onChange?.(val);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectClick = (val: string) => {
        if (val === "__empty__") return;

        onChange?.(val);
        onSelectOption?.(val);

        setTimeout(() => setOpen(false), 80);
    };


    const renderField = () => {

        if (disabled) {
            return (
                <InputWrapper>
                    <Input
                        disabled
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        $hasIcon={!!icon}
                    />
                </InputWrapper>
            );
        }

        switch (type) {

            case "textarea":
                return (
                    <Textarea
                        disabled={disabled}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        $error={hasError}
                    />
                );

            case "datetime":
                return (
                    <InputWrapper>
                        <Input
                            type="datetime-local"
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => handleChange(e.target.value)}
                            onBlur={handleBlur}
                            $error={hasError}
                            $hasIcon={!!icon}
                        />
                    </InputWrapper>
                );

            case "select":
                return (
                    <div>
                        <SelectWrapper ref={wrapperRef}>
                            <DropdownHeader
                                onClick={() => !disabled && setOpen(!open)}
                                $error={hasError}
                                style={{
                                    opacity: disabled ? 0.6 : 1,
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    pointerEvents: disabled ? "none" : "auto"
                                }}
                            >
                                {value && options.length > 0 ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        {options.find((opt) => opt.value === value)?.label}
                                    </div>
                                ) : (
                                    <PlaceholderText>Selecione...</PlaceholderText>
                                )}

                                <Arrow $open={open}>▾</Arrow>
                            </DropdownHeader>

                            {open && (
                                <DropdownList>
                                    <DropdownItem
                                        key="empty"
                                        onMouseDown={() => setOpen(false)}
                                        $selected={false}
                                        style={{ fontStyle: "italic", opacity: 0.6, pointerEvents: "none" }}
                                    >
                                        Selecione...
                                    </DropdownItem>

                                    {options.map((opt) => (
                                        <DropdownItem
                                            key={opt.value}
                                            onMouseDown={() => handleSelectClick(opt.value)}
                                            $selected={value === opt.value}
                                        >
                                            {opt.label}
                                        </DropdownItem>
                                    ))}
                                </DropdownList>
                            )}
                        </SelectWrapper>

                        {externalError && <ErrorMessage>{externalError}</ErrorMessage>}
                        {error && !externalError && required && (!value || value === "") && (
                            <ErrorMessage>Campo obrigatório</ErrorMessage>
                        )}
                    </div>
                );

            case "number":
                return (
                    <InputWrapper>
                        <span style={{ position: "absolute", left: "12px", color: "#555" }}>R$</span>
                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => {
                                let val = e.target.value;

                                val = val.replace(/[^\d,]/g, "");

                                const partes = val.split(",");
                                if (partes.length > 2) return;

                                let inteira = partes[0].replace(/^0+(?=\d)/, "");
                                inteira = inteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

                                let final = inteira;

                                if (partes[1] !== undefined) {
                                    final += "," + partes[1].slice(0, 2);
                                }

                                handleChange(final);
                            }}
                            onBlur={handleBlur}
                            $error={hasError}
                            style={{ paddingLeft: "36px" }}
                        />
                    </InputWrapper>
                );

            case "select-cards":
                return (
                    <div>
                        <DropdownWrapper ref={wrapperRef}>
                            <DropdownHeader
                                onClick={() => !disabled && setOpen(!open)}
                                $error={hasError}
                                style={{
                                    opacity: disabled ? 0.6 : 1,
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    pointerEvents: disabled ? "none" : "auto"
                                }}
                            >
                                {value && options.some((o) => o.value === value) ? (
                                    options.find((o) => o.value === value)?.element ??
                                    options.find((o) => o.value === value)?.label
                                ) : (
                                    <PlaceholderText>Selecione...</PlaceholderText>
                                )}
                                <Arrow $open={open}>▾</Arrow>
                            </DropdownHeader>

                            {open && (
                                <DropdownList>
                                    <DropdownItem
                                        key="empty"
                                        $selected={!value}
                                        style={{ fontStyle: "italic", opacity: 0.6, pointerEvents: "none" }}
                                    >
                                        Selecione...
                                    </DropdownItem>

                                    {options.map((opt) => (
                                        <DropdownItem
                                            key={opt.value}
                                            onMouseDown={() => handleSelectClick(opt.value)}
                                            $selected={value === opt.value}
                                        >
                                            {opt.element ?? opt.label}
                                        </DropdownItem>
                                    ))}
                                </DropdownList>
                            )}
                        </DropdownWrapper>

                        {externalError && <ErrorMessage>{externalError}</ErrorMessage>}
                        {error && !externalError && required && !value && (
                            <ErrorMessage>Campo obrigatório</ErrorMessage>
                        )}
                    </div>
                );

            case "password":
                return (
                    <InputWrapper>
                        {icon && <IconArea>{icon}</IconArea>}

                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => handleChange(e.target.value)}
                            onBlur={handleBlur}
                            $error={hasError}
                            $hasIcon={!!icon}
                            $hasPasswordToggle
                        />

                        <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </PasswordToggle>
                    </InputWrapper>
                );

            case "select-creatable":
                return (
                    <DropdownWrapper ref={wrapperRef}>
                        <Input
                            type="text"
                            disabled={disabled}
                            placeholder={allowCreate ? "Selecione ou crie uma nova..." : "Selecione..."}
                            value={value}
                            onFocus={() => setOpen(true)}
                            onChange={(e) => handleChange(e.target.value)}
                            onBlur={handleBlur}
                            $error={hasError}
                        />

                        {open && (
                            <DropdownList>
                                {options
                                    .filter((opt) =>
                                        opt.label?.toLowerCase().includes(value.toLowerCase())
                                    )
                                    .map((opt) => (
                                        <DropdownItem
                                            key={opt.value}
                                            onMouseDown={() => {
                                                handleChange(opt.label ?? "");
                                                onSelectOption?.(opt.label ?? opt.value);
                                                setOpen(false);
                                            }}
                                            $selected={value === opt.label}
                                        >
                                            {opt.label}
                                        </DropdownItem>
                                    ))}

                                {allowCreate &&
                                    !options.some(
                                        (opt) => opt.label?.toLowerCase() === value.toLowerCase()
                                    ) &&
                                    value.trim() !== "" && (
                                        <DropdownItem
                                            onMouseDown={() => {
                                                handleChange(value);
                                                onSelectOption?.(value);
                                                setOpen(false);
                                            }}
                                            $selected={false}
                                            style={{ fontStyle: "italic", opacity: 0.8 }}
                                        >
                                            Criar “{value}”
                                        </DropdownItem>
                                    )}
                            </DropdownList>
                        )}

                        {externalError && <ErrorMessage>{externalError}</ErrorMessage>}
                    </DropdownWrapper>
                );


            default:
                return (
                    <InputWrapper>
                        {icon && <IconArea>{icon}</IconArea>}
                        <Input
                            type="text"
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => handleChange(e.target.value)}
                            onBlur={handleBlur}
                            $error={hasError}
                            $hasIcon={!!icon}
                        />
                    </InputWrapper>
                );
        }
    };

    return (
        <InputContainer $width={width}>
            <Titulo
                title={
                    <>
                        {title}
                        {required && <span style={{ color: COLORS.danger_text }}> *</span>}
                    </>
                }
                marginBottom="4px"
            />
            {renderField()}
            {externalError && <ErrorMessage>{externalError}</ErrorMessage>}
            {error && !externalError && <ErrorMessage>Campo obrigatório</ErrorMessage>}
        </InputContainer>
    );
}


const InputContainer = styled.div<{ $width: string }>`
  display: flex;
  flex-direction: column;
  width: ${({ $width }) => $width};
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const IconArea = styled.div`
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: #555;
`;

const BaseField = `
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
  transition: 0.2s;
  background-color: white;

  &:focus {
    border-color: ${COLORS.primary};
    outline: none;
  }
`;

const Input = styled.input<{
    $error?: boolean;
    $hasIcon?: boolean;
    $hasPasswordToggle?: boolean;
}>`
  ${BaseField};
  border-color: ${({ $error }) => ($error ? COLORS.danger_text : "#ccc")};
  padding-left: ${({ $hasIcon }) => ($hasIcon ? "42px" : "10px")};
  padding-right: ${({ $hasPasswordToggle }) => ($hasPasswordToggle ? "42px" : "10px")};
`;

const PasswordToggle = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #555;
`;

const Textarea = styled.textarea<{ $error?: boolean }>`
  ${BaseField};
  min-height: 90px;
  resize: vertical;
  border-color: ${({ $error }) => ($error ? COLORS.danger_text : "#ccc")};
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const PlaceholderText = styled.span`
  color: black;
`;

const DropdownHeader = styled.div<{ $error?: boolean }>`
  ${BaseField};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-color: ${({ $error }) => ($error ? COLORS.danger_text : "#ccc")};
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Arrow = styled.span<{ $open?: boolean }>`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%) rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  font-size: 14px;
  pointer-events: none;
  transition: transform 0.2s;
  color: #000;
`;

const DropdownList = styled.div`
  position: absolute;
  width: 100%;
  background: white;
  border: 2px solid #ccc;
  border-radius: 6px;
  margin-top: 4px;
  max-height: 220px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const DropdownItem = styled.div<{ $selected: boolean }>`
  padding: 8px;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? "#f0f7ff" : "transparent")};
  border-bottom: 1px solid #eee;

  &:hover {
    background: #f8fbff;
  }
`;

const ErrorMessage = styled.span`
  color: ${COLORS.danger_text};
  font-size: 13px;
  margin-top: 4px;
`;
