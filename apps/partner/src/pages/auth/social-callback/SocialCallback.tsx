import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { socialLogin } from "@shared/api/auth/social";
import { tokenProvider } from "@shared/providers/tokenProvider";

const SocialCallback = () => {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = searchParams.get("code");
    if (!code || !provider) {
      navigate("/", { replace: true });
      return;
    }

    const redirectUri = `${window.location.origin}/auth/${provider}/callback`;

    socialLogin(provider, code, redirectUri)
      .then((result) => {
        if (result.authenticated && result.loginResponse) {
          tokenProvider?.setAccessToken?.(result.loginResponse.accessToken);
          tokenProvider?.setRefreshToken?.(result.loginResponse.refreshToken);
          navigate("/dashboard", { replace: true });
        } else if (result.newUser) {
          navigate("/social-verify", {
            replace: true,
            state: {
              socialEmail: result.socialEmail,
              socialName: result.socialName,
              provider: result.provider,
              providerId: result.providerId,
            },
          });
        } else {
          navigate("/", { replace: true });
        }
      })
      .catch(() => {
        navigate("/", { replace: true });
      });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-text-200 text-sm">로그인 처리 중...</p>
    </div>
  );
};

export default SocialCallback;
