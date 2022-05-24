import { Spin } from "antd";
import { FC } from "react";
import s from "./Preloader.module.scss";

const Preloader: FC = () => {
  return (
    <div className={s.preloader}>
      <Spin size="large" />
    </div>
  );
};

export default Preloader;
