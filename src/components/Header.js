import {Link,useLocation} from "react-router-dom";
const Header=()=>{
    const location=useLocation();
    let path=location.pathname;
    return(
        <header className="header">
            <h1>Poker Tester</h1>
            {path==="/"?<Link to="/auto">
                <button className="btn btn-primary">Auto Test</button>
            </Link>:""}
            {path==="/auto"?<Link to="/">
                <button className="btn btn-secondary">Back</button>
            </Link>:""}
        </header>
    )
}

export default Header;