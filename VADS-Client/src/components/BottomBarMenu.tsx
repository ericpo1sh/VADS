import React from "react"

interface BottomBarMenuProps {
  setActiveComponent: React.Dispatch<React.SetStateAction<"leaderboard" | "recordings">>;
  activeComponent: "leaderboard" | "recordings";
}

export const BottomBarMenu: React.FC<BottomBarMenuProps> = ({ setActiveComponent, activeComponent }) => {
  const getButtonStyle = (buttonName: "leaderboard" | "recordings") => {
    return buttonName === activeComponent
      ? { color: '#3619DC', fontWeight: '600' }
      : {};
  };

  return (
    <div style={{ display: "flex", flexDirection: 'column', width: '15%', height: '92%', margin: '7px 0px 7px 12px', borderRadius: '20px 20px 20px 20px', justifyContent: 'space-evenly', alignContent: 'center', alignItems: 'center' }}>
      <button style={{ width: '90%', border: '2px solid black', borderRadius: '10px', height: '30%', backgroundColor: '#d9d9d9', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, cursor: 'pointer', ...getButtonStyle("leaderboard") }} onClick={() => setActiveComponent("leaderboard")}>
        <p style={{ fontSize: '24px', fontFamily: 'Roboto Mono' }}>Leaderboard</p>
      </button>
      <button style={{ width: '90%', border: '2px solid black', borderRadius: '10px', height: '30%', backgroundColor: '#d9d9d9', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, cursor: 'pointer', ...getButtonStyle("recordings") }} onClick={() => setActiveComponent("recordings")}>
        <p style={{ fontSize: '24px', fontFamily: 'Roboto Mono' }}>Recordings</p>
      </button>
    </div>
  )
}
