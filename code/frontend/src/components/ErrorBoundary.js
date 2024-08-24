import { Component } from 'react';

import PageTemplate from './PageTemplate';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <PageTemplate title="Error! Uh oh!">
                    <p><strong>Something went wrong :(</strong></p>
                    <p>Technical details: {this.state.error.message}</p>
                </PageTemplate>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;