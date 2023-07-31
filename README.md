# INTRODUCTION

NOTE: This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm test`

All the test file ends with .spec.js or .test.js or inside the \_\_test\_\_ folder, where it has simply the .js files inside are considered the test files and `jest` will pick up all these files.

# ALL ABOUT @testing-library/react

## Queries

### About Queries

- Single Elements
  - `getBy...` Returns the matching node for a query, and throw a descriptive error if no elements match or if more than one match is found
  - `queryBy...` Returns the matching node for a query, and return `null` if no elements match. This is useful for asserting an element that is not present.
  - `findBy...` Returns a Promise which resolves when an element is found which matches the given query. The promise is rejected if no element is found or if more than one element is found after a default timeout of 1000ms.
- Multiple Elements

  - `getAllBy...` Returns an array of all matching nodes for a query, and throws an error if no elements match.
  - `queryAllBy...` Returns an array of all matching nodes for a query, and return an empty array ([]) if no elements match.
  - `findAllBy...` Returns a promise which resolves to an array of elements when any elements are found which match the given query. The promise is rejected if no elements are found after a default timeout of 1000ms.

  ![Alt text](/images/QueryCheatSheet.png)

#### Summing up all

| Goal of test                       | Use                     | Comments                                                                   |
| :--------------------------------- | :---------------------- | :------------------------------------------------------------------------- |
| Prove an element exists            | `getBy`, `getAllBy`     |
| Prove an element does not exist    | `queryBy`, `queryAllBy` |
| Prove an element eventually exists | `findBy`, `findAllBy`   | This waits for 1 sec by default to find the element and if not, it rejects |

An example of these:

```
Say we have a textbox missing in JSX and we intended to test it.

it("Basic example getBy queryBy findBy", async () => {
  render(<UserList users={users}></UserList>);
  expect(() => screen.getByRole("textbox")).toThrow();
  expect(screen.queryByRole("textbox")).toBeNull();
  await expect(screen.findByRole("textbox")).rejects.toThrow();
});

Say we have a single textbox missing in JSX and we intended to test it.

it("Basic example getBy queryBy findBy", async () => {
  render(<UserList users={users}></UserList>);
  expect(() => screen.getByRole("textbox")).toHaveLength(1);
  expect(screen.queryByRole("textbox")).toHaveLength(1);
  await expect(screen.findByRole("textbox")).resolves.toHaveLength(1);
});


```

### ByRole

**Always prefer to use ByRole and if you don't have an option, then go and use others.**

Refer to this [link](https://www.w3.org/TR/html-aria/#docconformance) to see all roles.

Some common roles are as below:

- `<a href="/"></a>` &#8594; link
- `<button></button>` &#8594; button
- `<footer></footer>` &#8594; contentinfo
- `<h1></h1>` &#8594; heading (h1, h2, h3, h4, h5 and h6)
- `<header></header>` &#8594; banner
- `<img src="" alt="" />` &#8594; img
- `<input type="text" name="" id="" />` &#8594; textbox
- `<input type="checkbox" name="" id="" />` &#8594; checkbox
- `<input type="radio" name="" id="" />` &#8594; radio
- `<input type="number" name="" id="" />` &#8594; spinbutton
- `<li></li>` &#8594; listitem
- `<ul></ul>` &#8594; listgroup

#### Example 1 : Basic use or role

```
const inputs = screen.getAllByRole("textbox");
const button = screen.getByRole("button");
```

#### Example 2 : Get a specific element based on name

If we want to be more specific we can with `getByRole` as below. The second parameter is the `name` which typically looks for the label text.

```
<button>submit</button>
```

```
screen.getByRole("button", {name : /submit/i });
```

##### Example 3 : Get a specific element based on label

We can selectively choose elements based on the label. Say for a textbox we have the below HTML

```
<label htmlFor="fName">Full Name</label>
<input id="fName" />
```

```
screen.getByRole("textbox", { name: /Full Name/i });
```

##### Example 3 : Get a specific element based on aria-label

Sometimes buttons don't have inner text, we can add `aria-label` to tell what the gutton actually does. Say for example we have a **search** button as below:

```
<button aria-label>
  <svg/>
</button>
```

```
screen.getByRole("button", {name : /search/i });
```

### ByLabelText

```
<label htmlFor="email">Email</label>
<input type="text" id="email" />
```

Now to get the appropriate input element we do as. It specifically searches for label with text `/email/i`. It chooses anything with the id `email`

```
const nameInput = screen.getByLabelText(/email/i);
```

If we wanted to choose something particular but not any element, use the format discussed in `ByRole` with `name` as second parameter.

### ByText

If we don't care about what element but if we want to fetch element based on visible text on the DOM, we do the below:

```
const nameInput = screen.getByText("email");
```

**Note**: ByText looks for the entire text say we are looking for `30` but we have a `<div>30 items</div>` it fails as it looks for the entire text within a tag. In that case We can use regular expressions instead as `/30/` and this just looks for a matching text.

### ByDisplayValue

It is used to get the input textboxes based on value inside it.

Say for example:

```
<input type="text" id="lastName" />
document.getElementById('lastName').value = 'Norris'
```

We can test as below:

```
const lastNameInput = screen.getByDisplayValue('Norris')
```

We can do the same for textarea and select dropdowns as well.

### ByAltText

For search for all images based on alt text we do as below:

```
<img alt="Incredibles 2 Poster" src="/incredibles-2.png" />

const incrediblesPosterImg = screen.getByAltText("Incredibles 2 Poster")
```

### ByTitle

As we know we use `title` to show extra information about element, when we hover over as native tooltip HTMP provides, we can see the info. To do so, we do the below:

```
<span title="Delete" id="2"></span>
```

```
const deleteElement = screen.getByTitle('Delete')
```

### ByTestId

**This must be the last option, if nothing works choose this**

```
<div data-testid="custom-element" />
```

```
const element = screen.getByTestId('custom-element')
```

**Note: All the above we can use regular expressions instead of the strings we pass through. It's a choice of what we are looking in a test**

## within

If we want to search something within the found element we can use `within` which need to be imported from `@testing-library/react` as below:

```
import { within } from "@testing-library/react";
```

```
render(<UserList></UserList>);

const rows = within(screen.getByTestId("userListTesting")).getAllByRole("row");
expect(rows).toHaveLength(2);
```

In the above we did for `getByTestId``, we can use any query..

## Matchers

React testing library exposes extra matchers along with the ones that jest provides and are exposed on the global variable `expect`. We can find the whole list of matchers here -> https://github.com/testing-library/jest-dom#custom-matchers

### Custom matchers

Say we have to repeat a functionality and we want a custom matcher, say if we need to search for an element `within` we can do as below:

```
function toContainRole(container, role, quantity = 1) {
  const elements = within(container).queryAllByRole(role);
  if (elements.length === quantity) {
    return {
      pass: true,
    };
  } else {
    return {
      pass: false,
      message: () =>
        `Expected to find ${quantity} ${role} elements but got ${elements.length} elements`,
    };
  }
}
```

`expect` expects return value in a praticular way. Return value must be an object with key `pass` a boolean and/or `message` a function with a return string if we need to display in case the test fails.

Now We need to `extend` in `expect` as below:

```
  expect.extend({ toContainRole });
```

We can use normally in a test case as we does with expect as below:

```
render(<UserList></UserList>);
const targetNode = screen.getByTestId("userListTesting");
expect(targetNode).toContainRole("row", 2);
```

## Testing playground

If you add the below in your testcase and it generates an URL on console when we run the tests.

```
screen.logTestingPlaygroundURL();
```

Now we when we open the generated URL we get the UI as below, when we hover over any item we get the corresponding query there.

![Alt text](/images/testingPlayground1.png)

At times we cannot get the required query. Say we wanted to check for `tr` we cannot hover, just add some extra styles and we can get the exact query as below:

![Alt text](/images/testingPlayground2.png)

## Screen debug

The below prints all the resultant HTML on console, where we can check what is the DOM.

```
screen.debug()
```

# ALL ABOUT @testing-library/user-event

```
import user from "@testing-library/user-event";
```

We can simulate the user events as below:

- `user.click(element)` simulates clicking on provided element
- `user.keyboard('asdf')` simulates typing asdf
- `user.keyboard('{Enter}')` simulates pressing enter key.
