import { render, fireEvent, screen, act, getByRole, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';

test('test suite runs', () => {
  render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  expect(1).toBe(1)
});

test('app asks for login', () => {
  render(<App />);
  expect(screen.getByText('You can register and log into the platform from the top-right corner of the page (under "Login").')).toBeInTheDocument()
});

test('app contains a login link', () => {
  render(<App />);
  expect(screen.getByText("Login")).toBeInTheDocument()
});

test('pressing login link takes you to login page', () => {
  render(<App />);

  fireEvent.click(screen.getByText("Login"))

  expect(screen.getByText("Username:")).toBeInTheDocument()
  expect(screen.getByText("Password:")).toBeInTheDocument()
});

const random_username = `test_user${Math.random().toString().substring(2, 10)}`

test('can register an account and login', async () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText("Username:"), { target: { value: random_username }})
  fireEvent.change(screen.getByLabelText("Password:"), { target: { value: 'test_user_password' }})
  fireEvent.click(screen.getByText("Register"))

  await waitFor(() => screen.getByText("User registered!"))

  expect(screen.getByLabelText("Username:").value).toBe("")
  expect(screen.getByLabelText("Password:").value).toBe("")
});

test('registering same account causes an error', async () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText("Username:"), { target: { value: random_username }})
  fireEvent.change(screen.getByLabelText("Password:"), { target: { value: 'test_user_password' }})
  fireEvent.click(screen.getByText("Register"))

  await waitFor(() => screen.getByText("Couldn't register user"))

  const notification = screen.getByText("Couldn't register user")

  await waitForElementToBeRemoved(notification, { timeout: 6*1000}) // Wait up to 6 seconds for notification to clear
})

test('can login', async () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText("Username:"), { target: { value: random_username }})
  fireEvent.change(screen.getByLabelText("Password:"), { target: { value: 'test_user_password' }})
  fireEvent.click(screen.getAllByText("Login")[1])

  await waitFor(() => screen.getByText("WASM Endpoints"))

  expect(screen.getByText("WASM Endpoints")).toBeInTheDocument()
})

test('can create a virtual filesystem', async () => {
  render(<App />);

  await waitFor(() => screen.getByText("WASM Endpoints"))

  expect(screen.getByText("Virtual filesystems")).toBeInTheDocument()

  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "test_fs" }})

  fireEvent.click(screen.getByText("Create"))

  await waitFor(() => screen.getByText("Created a Virtual Filesystem"))
});

test('can destroy a virtual filesystem', async () => {
  render(<App />);

  await waitFor(() => screen.getByText("test_fs"))

  const virtualfs = screen.getByText("test_fs")

  fireEvent.click(screen.getByText("Delete"))

  await waitForElementToBeRemoved(virtualfs, { timeout: 6*1000}) // Wait up to 6 seconds for notification to clear

  expect(screen.getByText("Virtual filesystem deleted!")).toBeInTheDocument()
});

test('can create an endpoint', async () => {
  render(<App />);

  await waitFor(() => screen.getByText("Create a new endpoint"))

  fireEvent.click(screen.getByText("Create a new endpoint"))

  await waitFor(() => screen.getByText("WASM file:"))

  fireEvent.change(screen.getByLabelText("WASM file:"), { target: { files: [new File([""], 'hello.wasm')] }})

  fireEvent.click(screen.getAllByText("Create")[1])

  await waitFor(() => screen.getByText("hello.wasm"))
});

test('can delete an endpoint', async () => {
  render(<App />);

  await waitFor(() => screen.getByText("hello.wasm"))

  fireEvent.click(screen.getByText("Delete"))

  await waitFor(() => screen.getByText("Endpoint deleted!"))
});


test('can logout', async () => {
  render(<App />);

  await waitFor(() => screen.getByText("WASM Endpoints"))

  fireEvent.click(screen.getByText("Logout"))

  await waitFor(() => screen.getByText('You can register and log into the platform from the top-right corner of the page (under "Login").'))
});
