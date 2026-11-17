Square icon-only button — use in toolbars, table rows, and card headers where a labeled button would be too heavy.

```jsx
<IconButton icon={<TrashIcon size={16}/>} label="Delete project" variant="ghost" onClick={remove}/>
```

Always pass `label` (used as `aria-label`/tooltip). Variants: `ghost` (default, transparent), `primary`, `secondary`.
