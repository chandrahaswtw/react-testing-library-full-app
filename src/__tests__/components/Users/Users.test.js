import { screen, render, waitFor } from "@testing-library/react";
import Users from "../../../components/Users/Users";
import { BrowserRouter, useParams } from "react-router-dom";
import user from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { createServer } from "./../../../test/server";

// If URL orignated from same port, just use /users. Since external URL, use full URL.
createServer([
  {
    path: "https://jsonplaceholder.typicode.com/users",
    method: "get",
    res: (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: "43",
            name: "Chandrahas Balleda",
            email: "chandrahaswtw@gmail.com",
          },
          {
            id: "44",
            name: "Vikram seth",
            email: "vikram.seth@gmail.com",
          },
        ])
      );
    },
  },
]);

describe("Testing Users", () => {
  it("Basic render", async () => {
    render(
      <BrowserRouter>
        <Users></Users>
      </BrowserRouter>
    );
    user.click(screen.getByRole("button", { name: /Load users/i }));

    // This hack is not recommended. This is just used to see the output that's generated from data of MSW.
    // It gives an intentional delay of 2 sec.
    // A
    const pause = () => new Promise((resolve) => setTimeout(resolve, 2000));
    await act(async () => {
      await pause();
    });
    // screen.debug();
  });

  it("Should render users component", async () => {
    render(
      <BrowserRouter>
        <Users></Users>
      </BrowserRouter>
    );

    expect(
      screen.getByRole("button", { name: /Load users/i })
    ).toBeInTheDocument();

    const loadUsersButton = screen.getByRole("button", { name: /Load users/i });
    user.click(loadUsersButton);

    // role = status is embedded into the rotating-lines-loading.
    expect(
      screen.getByRole("status", { name: /rotating-lines-loading/i })
    ).toBeInTheDocument();

    // If we intend to use waitFor -> use await
    await waitFor(async () => {
      expect(
        screen.queryByRole("status", { name: /rotating-lines-loading/i })
      ).toBeNull();
      expect(screen.getByText(/43/i)).toBeInTheDocument();
      expect(screen.getByText(/Chandrahas Balleda/i)).toBeInTheDocument();
      expect(screen.getByText(/chandrahaswtw@gmail.com/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /see\-posts\-43/i })
      ).toBeInTheDocument();

      expect(screen.getByText(/44/i)).toBeInTheDocument();
      expect(screen.getByText(/Vikram seth/i)).toBeInTheDocument();
      expect(screen.getByText(/vikram.seth@gmail.com/i)).toBeInTheDocument();
      const seePosts44Button = screen.getByRole("button", {
        name: /see\-posts\-44/i,
      });
      expect(seePosts44Button).toBeInTheDocument();

      // onclick the see posts button will change the route and load the posts component.
      // Since we are not loading the <Posts> component, we cannot test it, but we can test window.location.pathname as we are using useNavigate() to route to a new page.
      user.click(seePosts44Button);
      expect(window.location.pathname).toBe("/44");
    });
  });
});
