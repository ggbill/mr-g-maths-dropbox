import React from "react"
import { Link } from 'react-router-dom'
import "./footer.scss"

interface InputProps {
    page: string
    setCurrentPath: (path: string) => void
}

const Footer = (props: InputProps) => {

    return (
        <section className="footer-section">
            <div className="left-content">
                Email: <a href="mailto:thanos.gidaropoulos@tta.org.uk">thanos.gidaropoulos@tta.org.uk</a>
            </div>
            <div className="middle-content">
            {props.page === "about" ?
                        <>
                            <Link to={'/'}>
                            <img className="logo" alt="logo" src={require("../../images/G-with-glow.png")} />
                            </Link>

                        </>
                        :
                        <img className="logo" alt="logo" src={require("../../images/G-with-glow.png")} onClick={() => props.setCurrentPath("")} />
                    }
            </div>
            <div className="right-content">

            </div>
        </section>
    )
}

export default Footer