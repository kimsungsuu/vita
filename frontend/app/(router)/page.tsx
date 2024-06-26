"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "@/public/styles/main.module.scss";
import ChallengeFrame from "@/components/ChallengeFrame";
import useUserStore from "@/store/user-store";
import DebuffItem from "@/components/ui/DebuffItem";
import { getIconPath } from "@/util/icons.js";
import { getUserCharacterImagePath, getBackgroundUrl } from "@/util/images";
import { getMyCharacterInfo } from "@/api/character";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/util/axios";

export default function Home() {
  const router = useRouter();
  const userStore = useUserStore();
  const [challengeModal, setChallengeModal] = useState(false);
  const [myCharacterInfo, setMyCharacterInfo] = useState<Character | null>(
    null
  );
  const toggleChallengeModal = () => setChallengeModal(!challengeModal);

  useEffect(() => {
    const fetchCharacterList = async () => {
      try {
        // 내 캐릭터 정보 가져오기
        const characterInfo = await getMyCharacterInfo();

        // 캐릭터가 죽었을 때 characterId 쿠키 삭제 및 deathId 쿠키 생성
        if (characterInfo.is_dead) {
          document.cookie =
            "characterId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = `deathId=${"isDeath"}; path=/; max-age=36000; secure; SameSite=None`;
        }

        // 쿠키에서 characterId 값 가져오기
        const cookies = document.cookie.split("; ");
        let characterIdValue = cookies.find((cookie) =>
          cookie.startsWith("characterId=")
        );

        // user nickname 쿠키에 저장
        document.cookie = `nickname=${characterInfo.nickname}; path=/; max-age=36000; secure; SameSite=None`;
        // 성별 및 몸 타입 쿠키에 저장
        document.cookie = `gender=${characterInfo.gender}; path=/; max-age=36000; secure; SameSite=None`;
        document.cookie = `bodyShape=${characterInfo.body_shape}; path=/; max-age=36000; secure; SameSite=None`;

        // 캐릭터 ID가 created일 때 해당 characterId로 변경
        if (characterIdValue && characterIdValue.split("=")[1] === "created") {
          // 쿠키의 characterId 값이 'created' 일 때 새 값으로 설정
          document.cookie = `characterId=${characterInfo.character_id}; path=/; max-age=36000; secure; SameSite=None`;
        }
        // 내 캐릭터 정보 저장
        setMyCharacterInfo(characterInfo);

        // 이후를 위한 스토어 별도 저장
        userStore.gender = characterInfo.gender;
        userStore.bodyShape = characterInfo.body_shape;
        userStore.name = characterInfo.nickname;
      } catch (error) {
        console.log("캐릭터 조회에 실패했습니다!.", error);
      }
    };

    fetchCharacterList();
    // 만약 첫번째 출석일 시에 출석 보상 페이지로 이동
    if (getCookie("attendance")) {
      router.push("/attendance");
    }
  }, []);

  // 배경화면 동적 설정 ***********************************************
  const getBackgroundName = (): string => {
    if (myCharacterInfo) {
      const backgroundItem = myCharacterInfo.character_item.find(
        (item) => item.type === "BACKGROUND"
      );
      return backgroundItem ? backgroundItem.name : "";
    }
    return "";
  };

  const backgroundName = getBackgroundName();
  const backgroundStyle = {
    backgroundImage: `url(${getBackgroundUrl(
      backgroundName ? backgroundName : "main-2500ms"
    )})`,
  };

  return (
    <div className={`${styles.main} background`} style={backgroundStyle}>
      {challengeModal && <ChallengeFrame onClose={toggleChallengeModal} />}
      <div className={styles.header}>
        <div className={`${styles.item} bg`}>
          <p>남은수명</p>
          <h2>{myCharacterInfo?.vita_point}년</h2>
        </div>
        <div className={styles["side-menu"]}>
          <Link href={`/settings`}>
            <Image
              src={getIconPath("option")}
              width={120}
              height={120}
              alt="option"
            ></Image>
          </Link>
          <button onClick={toggleChallengeModal}>
            <Image
              src={getIconPath("daily")}
              width={120}
              height={120}
              alt="daily"
            ></Image>
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles["debuff-menu"]}></div>
        <div className={styles.damagochi}>
          {myCharacterInfo ? (
            <Image
              src={getUserCharacterImagePath(
                myCharacterInfo.gender,
                myCharacterInfo.body_shape,
                "idle",
                0
              )}
              width={300}
              height={300}
              priority
              alt="damagochi"
            ></Image>
          ) : (
            ""
          )}
          <p>{myCharacterInfo?.nickname}</p>
        </div>
        <div className={styles["debuff-menu"]}>
          {myCharacterInfo &&
            myCharacterInfo.de_buff.map((debuff, index) => (
              <DebuffItem key={index} debuff={debuff} />
            ))}
        </div>
      </div>
      <div className={styles.menu}>
        <div className={styles.left}>
          <button className={styles.shop}>
            <Link href="/shop">
              <Image
                src={getIconPath("shop")}
                width={120}
                height={120}
                alt="shop"
              ></Image>
              <p>SHOP</p>
            </Link>
          </button>
          <button className={styles.report}>
            <Link href="/report">
              <Image
                src={getIconPath("report")}
                width={120}
                height={120}
                alt="report"
              ></Image>
            </Link>
          </button>
        </div>

        <div className={styles.center}>
          <button>
            <Link href="/health">
              <Image
                src={getIconPath("hospital")}
                width={240}
                height={240}
                alt="health"
              ></Image>
            </Link>
          </button>
        </div>
        <div className={styles.right}>
          <Link href="/game/single">
            <button className={styles.single}>
              <Image
                src={getIconPath("single")}
                width={120}
                height={120}
                alt="single"
              ></Image>
            </button>
          </Link>
          <Link href="/game/multi">
            <button className={styles.multi}>
              <Image
                src={getIconPath("pvp")}
                width={120}
                height={120}
                alt="multi"
              ></Image>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
