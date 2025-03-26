import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
          <h2 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาดบางอย่าง</h2>
          <p className="mb-4 text-gray-300">เราขออภัยในความไม่สะดวก</p>
          <div className="bg-gray-800 p-4 rounded-lg max-w-2xl w-full mb-4 overflow-auto">
            <p className="text-red-400">{this.state.error?.toString()}</p>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            โหลดหน้าใหม่
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;