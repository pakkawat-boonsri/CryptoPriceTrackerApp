import { View, Text, Pressable } from "react-native";
import React, { memo } from "react";

const FilterComponent = (props) => {
  const { filterDay, filterText, selectedRange, onSelectedRangeChange } = props;

  const isFilterSelected = (filter) => filter === selectedRange;

  return (
    <Pressable
      onPress={() => onSelectedRangeChange(filterDay)}
      style={{
        backgroundColor: isFilterSelected(filterDay)
          ? "#1E1E1E"
          : "transparent",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: isFilterSelected(filterDay) ? "white" : "grey" }}>
        {filterText}
      </Text>
    </Pressable>
  );
};

export default memo(FilterComponent);
