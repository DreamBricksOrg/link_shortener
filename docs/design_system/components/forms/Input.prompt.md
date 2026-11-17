Labeled text field with hint/error support.

```jsx
<Input label="Project name" placeholder="e.g. Q3 rebrand" value={v} onChange={e=>setV(e.target.value)}/>
```

Pass `error` to switch the border/hint to danger styling; pass `hint` for helper text.
