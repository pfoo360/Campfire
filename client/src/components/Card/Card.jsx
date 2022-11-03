import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import * as DOMPurify from "dompurify";
import CardCSS from "./Card.module.css";

const Card = React.forwardRef(({ story }, ref) => {
  const content = (
    <>
      <span className={CardCSS.Link_span}>
        <Link to={`/story/${story.id}`} className={CardCSS.Title_link}>
          {story.title.length < 51
            ? story.title
            : `${story.title.substring(0, 50)}...`}
        </Link>
      </span>

      <span className={CardCSS.Link_span}>
        <Link to={`/user/${story.uname}`} className={CardCSS.Author_link}>
          {story.uname}
        </Link>
      </span>

      <p
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            story.story.length < 501
              ? story.story
              : `${story.story.substring(0, 500)}...`,
            {
              USE_PROFILES: { html: true },
            }
          ),
        }}
        className={CardCSS.Story}
      ></p>

      <p className={CardCSS.Date}>
        {format(new Date(story.date), "yyyy-MM-dd HH:mm")}
      </p>
      {/*<div>{story.id}</div>*/}
      {/*<div>{story.uid}</div>*/}
    </>
  );

  const result = ref ? (
    <div ref={ref} className={CardCSS.Card}>
      {content}
    </div>
  ) : (
    <div className={CardCSS.Card}>{content}</div>
  );
  return result;
});

export default Card;

//title: 255, story: 9999
//<div
// dangerouslySetInnerHTML={{
//   __html: DOMPurify.sanitize(story, { USE_PROFILES: { html: true } }),
// }}
///>
