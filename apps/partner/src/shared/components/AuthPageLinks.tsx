import { useNavigate } from "react-router-dom";
import { FlexBox, Button, Icons } from "@repo/ui";
const { UserSearch, UserRound, Home } = Icons;

type LinkItem = "idFind" | "pwFind" | "join" | "home";

type AuthPageLinksProps = {
  items: LinkItem[];
};

const linkConfig = {
  idFind: { icon: UserSearch, label: "아이디를 잊으셨나요?", text: "아이디 찾기", path: "/idFind" },
  pwFind: { icon: UserSearch, label: "비밀번호를 잊으셨나요?", text: "비밀번호 찾기", path: "/pwFind" },
  join: { icon: UserRound, label: "아직 회원이 아니신가요?", text: "회원가입", path: "/join" },
  home: { icon: Home, label: "로그인 페이지로 돌아가기", text: "홈으로", path: "/" },
};

const AuthPageLinks = ({ items }: AuthPageLinksProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const config = linkConfig[item];
        const Icon = config.icon;
        return (
          <FlexBox key={item} className="justify-between">
            <div className="text-text-200 flex items-center gap-1 text-xs">
              <Icon className="size-4" />
              {config.label}
            </div>
            <Button variant="link-blue" size="h24" onClick={() => navigate(config.path)}>
              {config.text}
            </Button>
          </FlexBox>
        );
      })}
    </div>
  );
};

export default AuthPageLinks;
