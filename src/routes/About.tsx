import { FunctionComponent } from "react";

interface AboutPageProps {

}

const AboutPage: FunctionComponent<AboutPageProps> = () => {
  return (
    <div>
      <div className="attributions">
        <a target="_blank" href="https://icons8.com/icon/DV3qHrcVC6mq/music">Music</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
      </div>
    </div>
  );
}

export default AboutPage;