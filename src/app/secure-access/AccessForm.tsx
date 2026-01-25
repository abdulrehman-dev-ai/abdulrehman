"use client";

import React, { useState } from "react";
import { Flex, Button, Input, Heading, Icon } from "@/once-ui/components";

export default function AccessForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/private-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      fillWidth
      fillHeight
      horizontal="center"
      vertical="center"
      padding="l"
      background="surface"
    >
      <Flex
        direction="column"
        gap="32"
        padding="40"
        border="neutral-medium"
        radius="l"
        background="surface"
        maxWidth={400}
        fillWidth
      >
        <Flex direction="column" horizontal="center" gap="8">
          <Icon name="skillShield" size="l" onBackground="neutral-strong" />
          <Heading variant="display-default-s" align="center">
            Restricted Access
          </Heading>
        </Flex>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Flex direction="column" gap="16">
            <Input
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access code"
              autoFocus
              error={!!error}
              errorMessage={error}
            />
            <Button
              variant="primary"
              size="m"
              fillWidth
              loading={loading}
              type="submit"
            >
              Access
            </Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
}
