import { StyleSheet, View, ScrollView } from "react-native";
import { Button, ThemeProvider, ListItem, Icon } from "@rneui/themed";
export const Post = (props) => {
  const { posts } = props;
  return (
    <View>
      {posts.map((val) => (
        <ListItem key={val.id} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{val.post}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
};
