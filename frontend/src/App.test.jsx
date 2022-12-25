import { render, fireEvent, screen, act, getByRole, waitFor } from '@testing-library/react';
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

  fireEvent.change(screen.getByLabelText("Username:"), { target: { value: random_username }})
  fireEvent.change(screen.getByLabelText("Password:"), { target: { value: 'test_user_password' }})
  fireEvent.click(screen.getAllByText("Login")[1])

  await waitFor(() => screen.getByText("WASM Endpoints"))

  expect(screen.getByText("WASM Endpoints")).toBeInTheDocument()
});

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

  fireEvent.click(screen.getByText("Delete"))

  await waitFor(() => screen.getByText("Virtual filesystem deleted!"))
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
