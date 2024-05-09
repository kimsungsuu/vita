"use client";

import styles from "@/public/styles/chronic.module.scss";
import Gender from "@/components/member/Gender";
import Birth from "@/components/member/Birth";
import Button from "@/components/member/Button";
import Chronic from "@/components/member/Chronic";

import { useState } from "react";

export default function Page() {
  const [step, setStep] = useState<number>(0);
  const [gender, setGender] = useState<string>("none");
  const [birth, setBirth] = useState<string>("");
  const [chronic, setChronic] = useState<string | null>("none");

  const stepMessages: JSX.Element[] = [
    <>성별을 선택해주세요</>,
    <>나이를 입력해주세요</>,
    <>
      앓고 계신 <br></br>지병이 있으신가요?
    </>,
    <>회원 정보 작성을 완료하시겠습니까?</>,
  ];

  function renderContent() {
    if (step === 0) {
      return <Gender gender={gender} setGender={setGender} />;
    } else if (step === 1) {
      return <Birth birth={birth} setBirth={setBirth}></Birth>;
    } else if (step === 2) {
      return <Chronic chronic={chronic} setChronic={setChronic} />;
    }
  }

  const handleNext = (): void => {
    setStep(step + 1);
  };

  const handlePrev = (): void => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  function renderButton() {
    const showPrevButton = step > 0;
    const showNextButton =
      (step === 0 && gender !== "none") || (step === 1 && birth !== "");

    return (
      <Button
        step={step}
        handlePrev={handlePrev}
        handleNext={handleNext}
        topStep={stepMessages.length - 1}
        onClick={() => console.log("Button clicked!")}
        showPrevButton={showPrevButton} // 이전 버튼 활성화
        showNextButton={showNextButton} // 조건에 따라 다음 버튼 활성화
      />
    );
  }

  return (
    <div className={styles["chronic-layout"]}>
      <p className={styles["chronic-title"]}>{stepMessages[step]}</p>
      {renderContent()}
      {step === stepMessages.length - 1 ? (
        <div className={styles["step-button"]}>
          {step > 0 && <button onClick={handlePrev}>이전</button>}
          {step === stepMessages.length - 1 ? (
            <button onClick={handleNext}>완료</button>
          ) : (
            step < stepMessages.length - 1 && (
              <button onClick={handleNext}>다음</button>
            )
          )}
        </div>
      ) : (
        renderButton()
      )}
    </div>
  );
}
