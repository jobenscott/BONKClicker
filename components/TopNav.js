import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { SignMessage } from "./SignMessage";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    // router.push("/login");
  };

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[current]}
      className="mb-2"
    >
     
      
      {/* <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <Link href="/">
          <a>BONK Clicker</a>
        </Link>
      </Item>


      {user === null && (
        <>
          <Item
            className="float-right"
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
          >
            <Link href="/login">
              <SignMessage/>
            </Link>
          </Item>
        </>
      )}

      {user !== null && (
        <SubMenu
          icon={<CoffeeOutlined />}
          title={user && user.address}
          className="float-right"
        >
          <ItemGroup>
            <Item key="/user">
              <Link href="/user">
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item onClick={logout}>Logout</Item>
          </ItemGroup>
        </SubMenu>
      )} */}
       <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        // icon={<AppstoreOutlined />}
      >
       <WalletMultiButton className="btn btn-ghost mr-4" />
      </Item>

    </Menu>
  );
};

export default TopNav;
