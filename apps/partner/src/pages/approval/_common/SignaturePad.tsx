import { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button, Icons } from "@repo/ui";

type Props = {
  /** 서명 변경 시 호출 — null 이면 빈 캔버스, 아니면 base64 PNG dataURL */
  onChange: (dataUrl: string | null) => void;
  height?: number;
  className?: string;
};

/**
 * 마우스/터치로 서명을 그릴 수 있는 캔버스.
 *
 * - ResizeObserver 로 캔버스 실제 픽셀 크기 = CSS 표시 크기 동기화 (좌표 어긋남 방지)
 * - 고DPI 디스플레이 대응 (devicePixelRatio 반영)
 */
const SignaturePad = ({ onChange, height = 150, className }: Props) => {
  const sigRef = useRef<SignatureCanvas>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 캔버스 크기를 컨테이너에 맞춰 동적으로 조정 + 좌표계 보정
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sig = sigRef.current;
    if (!wrapper || !sig) return;

    const canvas = sig.getCanvas();

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const w = wrapper.clientWidth;
      const h = height;

      // CSS 표시 크기
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // 내부 픽셀 크기 (고DPI 대응)
      canvas.width = w * ratio;
      canvas.height = h * ratio;

      // 좌표계 스케일 보정 — 이걸 안 하면 마우스 위치가 어긋남
      const ctx = canvas.getContext("2d");
      ctx?.scale(ratio, ratio);

      sig.clear();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [height]);

  const handleEnd = () => {
    const sig = sigRef.current;
    if (!sig) return;
    if (sig.isEmpty()) {
      onChange(null);
      return;
    }
    onChange(sig.toDataURL("image/png"));
  };

  const handleClear = () => {
    sigRef.current?.clear();
    onChange(null);
  };

  return (
    <div className={className}>
      <div ref={wrapperRef} className="rounded-md border bg-white">
        <SignatureCanvas ref={sigRef} onEnd={handleEnd} penColor="black" />
      </div>
      <Button
        size="h28"
        variant="outline"
        type="button"
        onClick={handleClear}
        className="mt-2"
      >
        <Icons.Eraser className="size-3.5" />
        지우기
      </Button>
    </div>
  );
};

export default SignaturePad;
