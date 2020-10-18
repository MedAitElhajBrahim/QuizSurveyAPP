export default function loginRedirect(props) {

    localStorage.removeItem("user");
    props.history.push({
        pathname: "/login",
        state: {expiredTokenMessage: "Your login has expired, please login again"}
    });
    window.location.reload();

}