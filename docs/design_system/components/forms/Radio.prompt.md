Single radio option — map a list of these sharing the same `name` to build a group.

```jsx
{options.map(o => (
  <Radio key={o} name="view" label={o} checked={view===o} onChange={()=>setView(o)}/>
))}
```
