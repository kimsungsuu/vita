"use client";

import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import style from "@/public/styles/modal.module.scss";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<React.ElementRef<"dialog">>(null);

  // 현재 페이지의 경로
  const pathname = router.pathname;

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  // 모달 외부 클릭 시 종료
  // const closeModal = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) =>
  //   e.target === dialogRef.current && router.back();

  const closeModalOnButtonClick = () => {
    router.back();
  };

  return (
    <dialog
      ref={dialogRef}
      // onClick={closeModal}
      onClose={router.back}
      className={style["modal-outer"]}
    >
      <div className={`${style["modal-inner"]} bg`}>
        {children}
        <button
          className={style["close-btn"]}
          onClick={closeModalOnButtonClick}
        >
          <p>닫기</p>
        </button>
      </div>
    </dialog>
  );
}
