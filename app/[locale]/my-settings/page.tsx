import Link from "next/link"
import DangerZone from "./components/DangerZoneSection/DangerZone"
import Profile from "./components/ProfileSection/Profile"
import Security from "./components/SecuritySection/Security"
import "./mySettings.scss"

export default function Page() {
    return(
        <>
            <div className="linkReturn">
                <Link href={"/user"}>{"<-- Return"}</Link>
            </div>
            <div className="settingsWrapper">
                <Profile />
                <Security />
                <DangerZone />
            </div>
        </>
    )
};
