import styles from "@/styles/LeftPanel/Hero.module.css";
import { useEffect } from "react";

function Hero(props) {
  // attempt to figure out bringing in a specific style
  // useEffect(() =>{
  //   const container = document.getElementById("hero-container");
  //   container.classList.add(`${props.style}`)
  // }, [])

  return (
    <div className={styles.heroContainer} id="hero-container">
      <div className={styles.heroEmojis}>
        <p>🎣</p>
        <p>🐟</p>
        <p>💬</p>
      </div>
      <h1 className="text-[40px] font-lato font-black italic tracking-wide">
        WELCOME TO CHATFISH!
      </h1>
      <p className="font-raleway tracking-wide text-[18px] lg:text-[20px]">
        The perfect platform for people who want to connect with others, have
        fun conversations, and make new friends
      </p>
      <p className="font-raleway tracking-wide text-[18px] lg:text-[20px]">
        Once you join a ChatFish room, you will be able to see all the
        participants in real-time and interact with them through a group chat.
      </p>
      <p className="font-raleway tracking-wide text-[18px] lg:text-[20px] mb-2">
        ChatFish is a fantastic way to meet new people and have engaging
        conversations without the pressure of making a long-term commitment
      </p>
      <h2 className="text-[28px] lg:text-[28px] xl:text-[35px] font-lato italic font-bold">
        Because, the chat only lasts for one hour
      </h2>
    </div>
  );
}

export default Hero;
