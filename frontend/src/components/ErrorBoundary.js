import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React render error", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary">
          <h1>Something went wrong</h1>
          <p>We could not display this page.</p>
          <button type="button" onClick={this.handleReload}>
            Reload page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
