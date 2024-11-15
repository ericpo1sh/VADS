import React, { useState } from "react"
import { Account } from "./Account"
import { Record } from "./Record"
import { BottomBarMenu } from "./BottomBarMenu"
import { Leaderboard } from "./Leaderboard"
import { Recordings } from "./Recordings"

export const BottomBar: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<"leaderboard" | "recordings">("leaderboard");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "leaderboard":
        return <Leaderboard />;
      case "recordings":
        return <Recordings />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '215px', border: '4px white solid', marginTop: '-5px' }}>
      <Account />
      <Record />
      <BottomBarMenu setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
      {renderActiveComponent()}
    </div>
  )
}
