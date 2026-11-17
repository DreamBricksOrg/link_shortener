Primary button for actions — use for the single most important action in a view.

```jsx
<Button variant="primary" size="md" onClick={() => save()}>Save changes</Button>
```

Variants: `primary` (brand blue, main CTA), `secondary` (outlined, secondary actions), `ghost` (no border, low emphasis), `danger` (destructive actions). Sizes: `sm` (32px), `md` (40px), `lg` (48px). Pass `icon` + `iconPosition` for an icon button with a label; use `disabled` and `fullWidth` as needed.
