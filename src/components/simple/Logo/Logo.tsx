import { FC } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png";

const Logo: FC = () => {
  return (
    <Link to="/">
      <img src={logo} alt="Логотип" />;
    </Link>
  );
};

export default Logo;
