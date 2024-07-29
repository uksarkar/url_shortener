const BaseLayout = (props) => {
    return (
        <>
            <header>Header</header>
            {props.children}
            <footer>Footer</footer>
        </>
    );
};

export default BaseLayout;