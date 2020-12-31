import './about.scss';
import React from 'react'
import MenuBar from '../shared/MenuBar';


const About = () => {

    return (
        <>
            <MenuBar page="about" setCurrentPath={() => {}}/>
            <div className="content about-page">
                <div className="intro-section">
                    <span className="title">Welcome young maths Gs and old!</span>
                    <p>
                        Mr G is short for Mr Gidaropoulos (not gangsta) and I am a maths teacher at The Totteridge Academy. I built this website to help you understand mathematics through my video solutions to past paper questions. These are accompanied by some maths chants we use at The Totteridge Academy, which are crucial in highlighting the key knowledge you need in a way that is easy to memorise. There are also some key skills videos that target specific grades for all types of maths dons.
                </p>
                    <p>
                        At The Totteridge Academy, we love helping everyone do well and enjoy maths so even if you are not part of our school, you are still more than welcome to use this site and pass it on to others too!
                </p>
                    <p>
                        If you need any information, have any requests or want to provide any feedback (feedback is a gift), my email is <a href="mailto:thanos.gidaropoulos@tta.org.uk">thanos.gidaropoulos@tta.org.uk</a>.
                </p>
                    <p>
                        Maths is life,
                </p>
                    <p>
                        Mr G
                </p>
                </div>
            </div>
        </>
    )
}

export default About