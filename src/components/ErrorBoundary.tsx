import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Shield } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleGoAdmin = () => {
    window.location.href = '/admin';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070e1c] text-slate-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c162d] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-extrabold text-base text-white tracking-tight">
                অ্যাপ লোড করতে সাময়িক সমস্যা হয়েছে
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                কোনো একটি উপাদানে ত্রুটি ঘটেছে। নিচের বাটনে ক্লিক করে পুনরায় লোড করুন।
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#050a16] border border-red-900/40 rounded-xl text-left overflow-auto max-h-36">
                <p className="text-[11px] font-mono text-red-400 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>রিলোড করুন</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>হোমে যান</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={this.handleGoAdmin}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>এডমিন প্যানেলে যেতে এখানে ক্লিক করুন</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
