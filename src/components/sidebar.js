import { Link } from "react-router-dom";
const Sidebar=({active})=>{
    let tabs={
        "connection":{
            text:"Connection",
            logoUrl:"https://fonts.gstatic.com/s/i/materialiconsoutlined/cable/v9/24px.svg",
            to:"/connection",
            active:false
        },
        "request":{
            text:"Request",
            logoUrl:"https://fonts.gstatic.com/s/i/materialiconsoutlined/api/v6/24px.svg",
            to:"/request",
            active:false
        },
        "auto":{
            text:"Auto Test",
            logoUrl:"https://fonts.gstatic.com/s/i/materialiconsoutlined/flash_auto/v11/24px.svg",
            to:"/auto",
            active:false
        },
        "about":{
            text:"About",
            logoUrl:"https://fonts.gstatic.com/s/i/materialiconsoutlined/info/v18/24px.svg",
            to:"/about",
            active:false
        }
    }

    tabs[active].active=true;

    let tabLinks=[]
    for(let tab in tabs){
        let tabLink=<div className={"nav-tab "+(tabs[tab].active?"active":"")}>
            <Link className="nav-link" to={tabs[tab].to} >
            <img className="tab-icon" src={tabs[tab].logoUrl}></img>
            <h4 className="link-text">{tabs[tab].text}</h4>
            </Link>
        </div>
        tabLinks.push(tabLink);
    }
    return (
        <div className="sidebar">
            {tabLinks}
        </div>
    )

}


export default Sidebar