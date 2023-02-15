import styles from "@/styles/LeftPanel/Hero.module.css"

function Hero() {
    return <div className={styles.heroContainer}>
    <div className={styles.heroEmojis}>
      <p>🐱🎣</p>
      <p>🕵️</p>
      <p>🥸</p>
    </div>
    <h1 className="md:text-[40px] font-lato font-black italic tracking-wide">
      WELCOME TO CATFISH!
    </h1>
    <p className="font-raleway tracking-wide">
      In this social media-inspired game, players work together to catch the
      elusive catfish, but be careful - not everyone is who they claim to be!
    </p>
    <p className="font-raleway tracking-wide">
      Analyze messages, photos, and participate in minigames to expose the
      fake profiles and emerge victorious.
    </p>
    <p className="font-raleway tracking-wide mb-2">
      Can the detectives find the fraud, or will the catfish fool the group
      and stand to win it all?
    </p>
    <h2 className="lg:text-[25px] xl:text-[35px] font-lato italic font-bold">
      DO YOU HAVE WHAT IT TAKES TO CATCH THE CATFISH?
    </h2>
  </div>;
}

export default Hero;