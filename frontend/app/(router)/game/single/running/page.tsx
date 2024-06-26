"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/public/styles/running.module.scss";
import Image from "next/image";
import { getUserCharacterImagePath } from "@/util/images";
import useUserStore from "@/store/user-store";
import { registerGameResult } from "@/api/game";

export default function RunningPage() {
  // clickCount 상태를 초기화하고, 이를 업데이트하는 함수를 선언합니다.
  const router = useRouter();
  const userStore = useUserStore();
  const [clickCount, setClickCount] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const maxClicks: number = 50; // 총 클릭 수

  useEffect(() => {
    if (userStore.name === "") {
      alert("잘못된 요청으로 인해 메인 페이지로 돌아갑니다.");
      router.push("/");
    }

    if (clickCount > 0 && startTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const newElapsedTime = now - startTime;
        setElapsedTime(newElapsedTime);
        if (clickCount >= maxClicks) {
          clearInterval(interval);
          finalizeTime("running", newElapsedTime);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [clickCount, startTime]);

  const handleClick = (): void => {
    if (clickCount === 0) {
      setStartTime(Date.now());
    }
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    if (newClickCount >= maxClicks) {
      // 이 조건은 필요 없어질 수 있으며, useEffect에 의해 처리됩니다.
    }
  };

  const finalizeTime = async (type: string, finalTime: number) => {
    setElapsedTime(finalTime); // 클릭이 끝났을 때의 시간을 설정

    // 사용자의 결과 스토어에 저장 및 최고기록 비교
    userStore.setGameType("running");
    userStore.setRecord(finalTime);

    // 결과 api
    try {
      await registerGameResult(type, finalTime);
      router.push("/game/single/result"); // 결과 모달 띄우기
    } catch (error) {
      console.log("Score registration failed: ", error);
    }
  };

  // 게이지 비율 계산
  const gaugeWidth = (clickCount / maxClicks) * 100;

  const imageUrl = getUserCharacterImagePath(
    userStore.gender,
    userStore.bodyShape,
    "walking",
    (clickCount % 2) + 1
  );

  return (
    <div
      className={`bg ${styles.main} ${
        clickCount > 0 ? styles["bg-move"] : styles["bg-idle"]
      }`}
    >
      <div className={`${styles.top} `}>
        <h3 className={styles["special-font"]}>
          {(elapsedTime / 1000).toFixed(3)}s
        </h3>

        <div className={`bg ${styles.gaugeContainer}`}>
          <div
            className={styles.gaugeFill}
            style={{ width: `${gaugeWidth}%` }} // 게이지 너비를 동적으로 조정
          ></div>
        </div>

        <h1 className={styles["special-font"]}>{clickCount}</h1>
      </div>
      <div className={styles.mid}>
        <Image src={imageUrl} width={200} height={200} alt="damagochi"></Image>
      </div>
      <div className={styles.bottom}>
        <button onClick={handleClick} disabled={clickCount >= maxClicks}>
          <p>Click!</p>
        </button>
      </div>
    </div>
  );
}
