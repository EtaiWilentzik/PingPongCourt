import  "./Paragraph.css"
const Paragraph = ({ heading, content, id }) => {
    return (
        <>
            <h4 className="spacing" id={id}>{heading}</h4>
            <p className="paragraph-content" id={`${id}-content`}>{content}</p> {/* adding id for the p tag */}
        </>
    );
};


const ParagraphsContainer = () => {
    const paragraphs = [
        { heading: "About", content: "hello 1 asdfasdfadsfasdfasdfasdf ", id: "scrollspyHeading1" },
        { heading: "Register", content: "hello 2", id: "scrollspyHeading2" },
        { heading: "Log In", content: "hello 3", id: "scrollspyHeading3" }
    ];

    return (
        <>
            <nav id="navbar-example2" className="navbar bg-body-tertiary px-3 mb-3 fixedElement  ">
                <a className="navbar-brand" href="#">Navbar</a>
                <ul className="nav nav-pills">
                    {/*  loop through every element in the paragraph array and map the values accordingly.*/}
                    {paragraphs.map((para, index) => (
                     <li className="nav-item" key={index}>
                          <a className="nav-link" href={`#${para.id}`}>
                    {/* Check if the heading is "Log In" and handle it differently */}
                        {para.heading === "Log In" ? para.heading : para.heading.split(" ")[0]}
                          </a>
                     </li>
                    ))}
                </ul>
            </nav>

            {/* this is the items in this list */}
            <div data-bs-spy="scroll" data-bs-target="#navbar-example2"
                 data-bs-smooth-scroll="true" className="scrollspy-example bg-body-tertiary p-3 rounded-2 av" tabIndex="0">
                {paragraphs.map((para, index) => (
                    <Paragraph key={index} heading={para.heading} content={para.content} id={para.id}   />
                ))}
            </div>
        </>
    );
};
export { Paragraph, ParagraphsContainer };