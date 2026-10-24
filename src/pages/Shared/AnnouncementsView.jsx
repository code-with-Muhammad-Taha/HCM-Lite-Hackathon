import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";

const AnnouncementsView = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc")));
      setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Announcements</Typography>
      {list.map((a) => (
        <Paper key={a.id} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>{a.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{a.body}</Typography>
          <Typography variant="caption" display="block" mt={2} color="text.secondary">
            — {a.author} • {new Date(a.createdAt).toLocaleString()}
          </Typography>
        </Paper>
      ))}
      {list.length === 0 && <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>No announcements yet</Paper>}
    </Box>
  );
};

export default AnnouncementsView;