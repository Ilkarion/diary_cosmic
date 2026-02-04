'use client'
import "./recentEntries.scss"


export default function RecentEntries() {
    //title
    //date
    //feelings
    //colored text(max 100symbols)
    //tags
    return(
        <>
            <div>
                <p>Title</p>
                <p>14 August, 2026</p>
                <div>
                    <div>
                        <Image />
                        <span>Peacfull</span>
                    </div>
                    
                    <div>
                        <Image />
                        <span>Sad</span>
                    </div>
                    
                    <div>
                        <Image />
                        <span>Happy</span>
                    </div>
                </div>
                <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui illum voluptatem optio suscipit labore deleniti esse natus! Iusto, odit debitis. Sed ipsa officiis voluptatum, repellat pariatur adipisci eum. Minima, magnam?</div>
            </div>
        </>
    )
};
