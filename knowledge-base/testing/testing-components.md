# Component Testing Guidelines

## Component Types & Testing Approaches

### Presentational Components (No services, pure display)
- Use Angular Testing Library directly
- Focus on rendering and user interactions
- Test props/inputs and outputs/events
- Maximum 5-8 tests

### Smart Components (Connected to services)
- Mock external services only
- Test component behavior, not service implementation
- Use fakes for complex service interactions
- Focus on user workflows

## Testing Dialogs
- Don't test dialog opening/closing mechanisms (that's Angular's job)
- Focus on dialog content and user actions
- Mock DialogRef for dialog-specific behavior

## Common Mistake to Avoid
Never test framework internals:
❌ `expect(component).toBeTruthy()`
✅ `expect(screen.getByRole('heading')).toHaveTextContent('User Profile')`
