import { screen, render, waitFor } from "@testing-library/react";
import Posts from "../../../components/Posts/Posts";
import { BrowserRouter, useParams, useNavigate } from "react-router-dom";
import user from "@testing-library/user-event";
import { createServer } from "../../../test/server";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

// This works even if we have query params in the original URL.
// Don't use the query Params in the here below. This automatically picks up.
// If actual URL passes a query param (say ?userId=44 ), we can read them as below:
// req.url.searchParams.get("userId") --> .get("queryParamUsed") returns the actual param.
createServer([
  {
    path: "https://jsonplaceholder.typicode.com/posts",
    method: "get",
    res: (req, res, ctx) => {
      return res(
        ctx.json([
          {
            body: "Test body",
            id: 44,
            title: "Test title",
            userId: 44,
          },
        ])
      );
    },
  },
]);

describe("Testing posts", () => {
  it("Should render posts component", async () => {
    // Write the mcck statements above the render() so that all the mocks are rightly passed to component.
    useParams.mockReturnValue({ id: 44 });

    // We are using useNavigate() in component and this returns a function and we are making a call.
    const useNavigateInternalMock = jest.fn();
    useNavigate.mockReturnValue(useNavigateInternalMock);

    render(
      <BrowserRouter>
        <Posts></Posts>
      </BrowserRouter>
    );

    expect(
      screen.getByRole("status", { name: /rotating-lines-loading/i })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByRole("status", { name: /rotating-lines-loading/i })
      ).toBeNull();
      expect(screen.getByText(/Test body/i)).toBeInTheDocument();
      expect(screen.getByText(/44/)).toBeInTheDocument();
      expect(screen.getByText(/Test title/)).toBeInTheDocument();
      user.click(screen.getByRole("button", { name: /Go back/i }));
      expect(useNavigateInternalMock).toHaveBeenCalledTimes(1);
      expect(useNavigateInternalMock).toHaveBeenCalledWith(-1);
    });
  });
});
