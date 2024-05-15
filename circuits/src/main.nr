fn main(recorded_value: u32, lower_check_value: pub u32, higher_check_value: pub u32) {
    if recorded_value >= lower_check_value {
        assert(recorded_value <= higher_check_value);
    }
}
