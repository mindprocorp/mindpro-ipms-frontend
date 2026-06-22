import React, { useEffect, useRef, useState } from "react";

export type NameTagTypes = {
  name: string;
  team: string;
  position: string;
  head: string;
  children?: React.ReactNode;
};

export type ActionsType = {
  onSelect: () => void;
  checked: boolean;
};

const dummy = [
  {
    url: "https://png.pngtree.com/thumb_back/fh260/background/20240412/pngtree-happy-small-dog-is-running-on-a-grass-in-park-in-image_15655854.jpg",
    name: "홍길동",
    team: "웹개발팀",
    position: "대리",
    head: "",
    mail: "hong@gmail.com",
  },
  {
    url: "https://imagescdn.gettyimagesbank.com/500/202411/a13877208.jpg",
    name: "황진이",
    team: "웹개발팀",
    position: "과장",
    head: "부서장",
    mail: "hwang@gmail.com",
  },
  {
    url: "https://www.urbanbrush.net/web/wp-content/uploads/edd/2023/02/urban-20230228144115810458.jpg",
    name: "홍길동2",
    team: "웹개발팀",
    position: "주임",
    head: "",
    mail: "test@gmail.com",
  },
];

export const useMembers = () => {
  const [team, setTeam] = useState<string>("");
  const [member, setMember] = useState<NameTagTypes[]>([]);
  const [check, setCheck] = useState<string[]>([]);
  const memberRef = useRef<NameTagTypes[]>([]);

  const memFind = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMember(
      memberRef?.current.filter((mem) => {
        return mem.name.includes(value);
      }),
    );
  };

  const selectHandle = (name: string) => {
    if (check.includes(name)) {
      setCheck((prev) => prev.filter((item) => item !== name));
      return;
    }
    setCheck((prev) => [...prev, name]);
  };

  const singleSelectHandle = (name: string) => {
    if (check.includes(name)) {
      setCheck((prev) => prev.filter((item) => item !== name));
      return;
    }
    setCheck([name]);
  };

  const clearCheck = () => {
    setCheck([]);
  };

  useEffect(() => {
    setMember(dummy);
    memberRef.current = dummy;
  }, []);

  return {
    member,
    setMember,
    check,
    setCheck,
    clearCheck,
    selectHandle,
    memFind,
    singleSelectHandle,
  };
};
